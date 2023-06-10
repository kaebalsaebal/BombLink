from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .base import Game

# Create your views here.
class TestAPI(APIView):
    def get(self,request):
        game = Game(int(request.query_params.get('x',5)), int(request.query_params.get('y',10)))
        return Response(data={
            "time" : '1',
            "board" : game.printGame()
        },status=status.HTTP_200_OK)
