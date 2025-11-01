
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    STATUS_CHOICES = [
        ('BUSY', 'Busy'),
        ('SWAPPABLE', 'Swappable'),
        ('SWAP_PENDING', 'Swap Pending'),
    ]

    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='BUSY')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return f"{self.title} ({self.owner}) {self.start_time.isoformat()}"

class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    my_slot = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='my_slot_requests')
    their_slot = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='their_slot_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Swap {self.id}: {self.requester} -> {self.receiver} [{self.status}]"


