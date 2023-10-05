from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .base import Game

game = Game(0,0)

# Create your views here.
class TestAPI(APIView):
    def get(self,request):
        global game
        game = Game(int(request.query_params.get('x',5)), int(request.query_params.get('y',10)))
        return Response(data={
            "time" : '1',
            "board" : game.printGame()
        },status=status.HTTP_200_OK)
    
class BombAPI(APIView):
    def post(self,request):
        global game
        curData = request.data
        sero = int(curData['sero'])
        karo = int(curData['karo'])
        game.rotateBomb(sero,karo)
        return Response(data={
            "board": game.printGame()
        }, status=status.HTTP_200_OK)
    
class GameAPI(APIView):
    def get(self,request):
        global game
        game.playGame()
        return Response(data={
            "board": game.printGame()
        }, status=status.HTTP_200_OK)
