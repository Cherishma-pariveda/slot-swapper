from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Event, SwapRequest
from .serializers import RegisterSerializer, EventSerializer, CreateEventSerializer, SwapRequestSerializer
from rest_framework import serializers
from django.db import transaction
from django.db.models import Q
User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    POST /api/register/
    Body: { "username":"alice", "password":"pass", "email":"a@b.com" }
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"detail":"User created", "id": user.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create','update','partial_update']:
            return CreateEventSerializer
        return EventSerializer

    def get_queryset(self):
        
        return Event.objects.filter(owner=self.request.user).order_by('start_time')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='swappable')
    def swappable(self, request):
        qs = Event.objects.filter(status='SWAPPABLE').exclude(owner=request.user)
        serializer = EventSerializer(qs, many=True)
        return Response(serializer.data)


class SwapRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SwapRequestSerializer

    def get_queryset(self):
    
        return  (
        SwapRequest.objects.filter(
            Q(requester=self.request.user) | Q(receiver=self.request.user)
        )
        .order_by("-created_at")
    )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='incoming')
    def incoming(self, request):
        """Swaps where the logged-in user is the receiver"""
        swaps = SwapRequest.objects.filter(receiver=request.user).order_by('-created_at')
        serializer = self.get_serializer(swaps, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='outgoing')
    def outgoing(self, request):
        """Swaps where the logged-in user is the requester"""
        swaps = SwapRequest.objects.filter(requester=request.user).order_by('-created_at')
        serializer = self.get_serializer(swaps, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='create_swap')
    def create_swap(self, request):
        my_slot_id = request.data.get('mySlotId')
        their_slot_id = request.data.get('theirSlotId')
        if not my_slot_id or not their_slot_id:
            return Response({"detail":"mySlotId and theirSlotId are required"}, status=status.HTTP_400_BAD_REQUEST)

        my_slot = get_object_or_404(Event, id=my_slot_id)
        their_slot = get_object_or_404(Event, id=their_slot_id)

        if my_slot.owner != request.user:
            return Response({"detail":"mySlot must belong to you"}, status=status.HTTP_403_FORBIDDEN)
        if their_slot.owner == request.user:
            return Response({"detail":"theirSlot must belong to another user"}, status=status.HTTP_400_BAD_REQUEST)
        if my_slot.status != 'SWAPPABLE' or their_slot.status != 'SWAPPABLE':
            return Response({"detail":"Both slots must be SWAPPABLE"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            swap_req = SwapRequest.objects.create(
                requester=request.user,
                receiver=their_slot.owner,
                my_slot=my_slot,
                their_slot=their_slot,
                status='PENDING'
            )
            my_slot.status = 'SWAP_PENDING'
            my_slot.save(update_fields=['status'])
            their_slot.status = 'SWAP_PENDING'
            their_slot.save(update_fields=['status'])
            serializer = SwapRequestSerializer(swap_req)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='respond')
    def respond(self, request, pk=None):
        """
        POST /api/swap-requests/<id>/respond/
        Body: {"accepted": true/false}
        """
        swap_req = get_object_or_404(SwapRequest, id=pk)
        accepted = request.data.get('accepted')
        if accepted is None:
            return Response({"detail":"'accepted' boolean required"}, status=status.HTTP_400_BAD_REQUEST)

        if swap_req.receiver != request.user:
            return Response({"detail":"Only the receiver can respond"}, status=status.HTTP_403_FORBIDDEN)
        if swap_req.status != 'PENDING':
            return Response({"detail":"Swap request already handled"}, status=status.HTTP_400_BAD_REQUEST)

        my_slot = swap_req.my_slot
        their_slot = swap_req.their_slot

        if accepted:
            with transaction.atomic():
                requester = swap_req.requester
                receiver = swap_req.receiver

                my_slot.owner = receiver
                my_slot.status = 'BUSY'
                my_slot.save(update_fields=['owner','status'])

                their_slot.owner = requester
                their_slot.status = 'BUSY'
                their_slot.save(update_fields=['owner','status'])

                swap_req.status = 'ACCEPTED'
                swap_req.save(update_fields=['status'])
            return Response({"detail":"Swap accepted"}, status=status.HTTP_200_OK)
        else:
            with transaction.atomic():
                my_slot.status = 'SWAPPABLE'
                my_slot.save(update_fields=['status'])
                their_slot.status = 'SWAPPABLE'
                their_slot.save(update_fields=['status'])
                swap_req.status = 'REJECTED'
                swap_req.save(update_fields=['status'])
            return Response({"detail":"Swap rejected"}, status=status.HTTP_200_OK)


