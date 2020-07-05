# first of all import the socket library 
import suspengine       
id = 1         
  
# emit("position","{'x':600,'y':200}",c)

def connection(c,addr,mess):
   global id
   suspengine.savevariable("connected",1,c)
   suspengine.savevariable("id",id,c)
   clientList = suspengine.callvariablelist("connected",1)
   newPlayer = {}
   newPlayer['id'] = suspengine.callvariable("id",c)
   id += 1
   for co in clientList:
      suspengine.emit("connected",newPlayer,co)

def deconexion(c,addr,mess):
   clientList = suspengine.callvariablelist("connected",1)
   movePlayer = {}
   movePlayer['id'] = suspengine.callvariable("id",c)
   for co in clientList:
      suspengine.emit("deconexion",movePlayer,co)

def move(c,addr,mess):
   suspengine.savevariable("x",mess['x'],c)
   suspengine.savevariable("y",mess['y'],c)
   suspengine.savevariable("a",mess['a'],c)
   suspengine.savevariable("at",mess['at'],c)
   suspengine.savevariable("dt",mess['dt'],c)
   suspengine.savevariable("s",mess['s'],c)
   suspengine.savevariable("n",mess['n'],c)
   suspengine.savevariable("sc",mess['sc'],c)
   clientList = suspengine.callvariablelist("connected",1)
   movePlayer = {}
   movePlayer['x'] = suspengine.callvariable("x",c)
   movePlayer['y'] = suspengine.callvariable("y",c)
   movePlayer['a'] = suspengine.callvariable("a",c)
   movePlayer['id'] = suspengine.callvariable("id",c)
   movePlayer['at'] = suspengine.callvariable("at",c)
   movePlayer['dt'] = suspengine.callvariable("dt",c)
   movePlayer['s'] = suspengine.callvariable("s",c)
   movePlayer['n'] = suspengine.callvariable("n",c)
   movePlayer['sc'] = suspengine.callvariable("sc",c)
   for co in clientList:
      if suspengine.callvariable("id",co) != suspengine.callvariable("id",c):
         suspengine.emit("move",movePlayer,co)


suspengine.addfunc("connection",connection)
suspengine.addfunc("move",move)
suspengine.addfunc("deconexion",deconexion)




suspengine.server("127.0.0.1",12345)