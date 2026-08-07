"""
More on the development side, here is where we can run an instance of the api (without reloading).

For an instance that reloads automatically when you make changes
use "uvicorn ServerConnection:app --reload" in the terminal
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run("ServerConnection:app", host="127.0.0.1", port=8000, reload=True)
