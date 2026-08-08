"""
The tether between the computer's brain and his face (between frontend and backend), AKA the API (using FastAPI).
"""
#Fast API imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#Logic imports
from api.Computer import process_feelings


#Decide who can access the API
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
################################################################################################################
@app.get("/brain")
def think():
    response = ""
    if process_feelings() == "happy":
        response = "I'm Happy"
    elif process_feelings() == "sad":
        response = "I'm sad"
    return response

