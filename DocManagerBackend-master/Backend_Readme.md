Backend Startup Commands

First and foremost, create the ```.venv``` or Virtual Environment using the ```command python -m venv .venv```

Enter the Virtual Environment: ```.venv\Scripts\activate.bat```

Install packages: ```pip install -r requirement.txt```

If not using Docker, install Tesseract manually for Windows (https://github.com/tesseract-ocr/tesseract)

Install Ollama executable at (https://ollama.com/download)

Migrate/create the database using cd docmanager_backend & python manage.py migrate

1st CMD Window: ```cd docmanager_backend``` & ```python manage.py runserver```

2nd CMD Window: ```cd docmanager_backend```  & ```python manage.py start_watcher```

File watcher/auto uploader will listen for files copied/created at media/uploads folder. 