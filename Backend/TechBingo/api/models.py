from django.db import models

# Create your models here.

class QuizSubmission(models.Model):
    username = models.CharField(max_length=100)  # Or use ForeignKey to User
    answers = models.JSONField()  # Store answers as {q1: "answer", q2: "answer", ...}
    attempted_count = models.IntegerField()
    unattempted_count = models.IntegerField()
    total_time_taken = models.IntegerField(help_text="Time in seconds")
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.submitted_at}"