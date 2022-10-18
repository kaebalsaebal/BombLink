from random import randint
from collections import deque

class bomb:
    # 심지 0-위 1-오른 2-아래 3-왼 -1-비활성화
    def __init__(self):
        pass
    
    def setBomb(self,x,y,simji):
        self.x = x
        self.y = y
        self.simji = simji
        
    def getBomb(self):
        return self.x, self.y, self.simji
        
    def rotate(self):
        self.simji+=1
        if self.simji>4:
            self.simji = 0
            
class fire:
    def __init__(self):
        self.x = 0
        self.y = 0
        
    def setFire(self,x,y):
        self.x = x
        self.y = y
        
    def getFire(self):
        return self.x,self.y
        
    def lowerFire(self):
        x,y = self.getFire()
        self.setFire(x,y+1)
        
    def clearFire(self):
        self.setFire()
        self.y = 0

class link:
    
    def __init__(self,karo,sero):
        self.karo = karo
        self.sero = sero
        self.fire = fire()
    
    def initBoard(self):
        self.board = [[bomb() for i in range(self.karo+2)] for j in range(self.sero+2)]
        
        x,y = randint(0,1),0
        if x==1:
            x = self.karo+1
        self.fire.setFire(x,y)
    
        for i in range(self.sero+1):
            for j in range(0,self.karo+2):
                if j==0 or j==self.karo+1:
                    if i==y and j==x:
                        self.board[i][j]=self.fire
                    else:
                        self.board[i][j]=0
                else:
                    if i<self.sero//2+1:
                        self.board[i][j].setBomb(j,i,-1)
                    else:
                        s = randint(0,3)
                        self.board[i][j].setBomb(j,i,s)
                        
    def destroyBoard(self,board,y,x):
        pokpa = deque([])
        pokpa.append([y,x])
        board[y][x].setBomb(x,y,-1)
        dy = [-1,0,1,0]
        dx = [0,1,0,-1]
        while pokpa:
            cur = pokpa.popleft()
            curx,cury,curs = board[cur[0]][cur[1]].getBomb()
            for i in range(4):
                temx=curx+dx[i]
                temy=cury+dy[i]
                tosso = False
                if 0<temx<self.karo+1 and 0<temy<self.sero+1:
                    a,b,c = board[temy][temx].getBomb()
                    if i==0 and c==2:
                        tosso = True
                    elif i==1 and c==3:
                        tosso = True
                    elif i==2 and c==0:
                        tosso = True
                    elif i==3 and c==1:
                        tosso = True
                    if tosso:
                        board[b][a].setBomb(a,b,-1)
                        pokpa.append([b,a])
                        
    def playBoard(self):
        x,y = self.fire.getFire()
        self.board[y][x]=0
        self.fire.lowerFire()
        x,y = self.fire.getFire()
        if y<self.sero+1:
            self.board[y][x]=self.fire
            if x==self.karo+1:
                if self.board[y][x-1].simji==1:
                    print('폭파')
                    self.destroyBoard(self.board,y,x-1)
            elif x==0:
                if self.board[y][x+1].simji==3:
                    print('폭파')
                    self.destroyBoard(self.board,y,x+1)
            return True
        return False
                
    def printBoard(self):
        for i in range(self.sero+1):
            for j in range(0,self.karo+2):
                if j==0 or j==self.karo+1:
                    if (j,i)==self.fire.getFire():
                        print('1',end=' ')
                    else:
                        print('0',end=' ')
                else:
                    x,y,s = self.board[i][j].getBomb()
                    if s==0:
                        print('↑',end=' ')
                    elif s==1:
                        print('→',end=' ')
                    elif s==2:
                        print('↓',end=' ')
                    elif s==3:
                        print('←',end=' ')
                    else:
                        print('0',end=' ')
            print()
        print()
            
class game:
    timer=0
    def __init__(self,karo,sero):
        self.link = link(karo,sero)
        self.link.initBoard()
        
    def printGame(self):
        self.link.printBoard()
        while self.link.playBoard():
            self.link.printBoard()
        
game = game(5,10)
game.printGame()
