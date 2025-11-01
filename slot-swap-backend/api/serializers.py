from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Event, SwapRequest

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User(username=validated_data['username'], email=validated_data.get('email',''))
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email')

class EventSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id','title','start_time','end_time','status','owner')

class CreateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id','title','start_time','end_time','status')
class SwapRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    my_slot = EventSerializer(read_only=True)
    their_slot = EventSerializer(read_only=True)

    class Meta:
        model = SwapRequest
        fields = ('id','requester','receiver','my_slot','their_slot','status','created_at')
