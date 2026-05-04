import asyncio
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import uvicorn

from langchain_openai import ChatOpenAI
from browser_use import Agent, Browser, BrowserConfig

load_dotenv()

app = FastAPI(title="SMM Agent API")

# Setup static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class TaskRequest(BaseModel):
    task: str

async def run_browser_task(task_description: str):
    print(f"Starting Browser Task: {task_description}")
    
    # Initialize the LLM
    llm = ChatOpenAI(model="gpt-4o", temperature=0.0)
    
    # Configure the browser with stealth settings
    config = BrowserConfig(
        headless=False,
        disable_security=True,
        extra_chromium_args=[
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--no-sandbox',
            '--window-size=1280,1024',
        ],
    )
    browser = Browser(config=config)
    
    try:
        agent = Agent(
            task=task_description,
            llm=llm,
            browser=browser
        )
        
        result = await agent.run()
        return {"success": True, "message": "Task completed successfully", "details": str(result)}
    except Exception as e:
        print(f"Agent Error: {e}")
        return {"success": False, "message": str(e)}
    finally:
        await browser.close()

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/run-task")
async def api_run_task(payload: TaskRequest):
    # Check if API key exists
    if not os.getenv("OPENAI_API_KEY"):
         return {"success": False, "message": "API Key is missing. Please add OPENAI_API_KEY to your .env file."}
         
    # Run the agent in the background or await it
    # For now, we await it so the frontend can show the loading state
    result = await run_browser_task(payload.task)
    return result

if __name__ == "__main__":
    print("Starting SMM Agent Web Interface...")
    print("Open http://localhost:8000 in your browser.")
    uvicorn.run(app, host="127.0.0.1", port=8000)
