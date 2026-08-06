from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import QuizSubmission

# Create your views here.
@api_view(['GET','POST'])
def submit_quiz(request):
    data = request.data
    QuizSubmission.objects.create(
        username=data.get('username', 'Anonymous'),
        answers=data.get('answers', {}),
        attempted_count=data.get('attempted_count', 0),
        unattempted_count=data.get('unattempted_count', 0),
        total_time_taken=data.get('total_time_taken', 0),
    )
    return Response({"message": "Quiz submitted successfully"}, status=status.HTTP_201_CREATED)