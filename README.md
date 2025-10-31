# CA copy — Remedial Teaching & Capacity Building (Django demo)

This folder contains a copy of the Django demo project under `CA/` so you can run it independently.

Quick start (Windows PowerShell):

```powershell
Set-Location 'C:\Users\DELL\Desktop\Acd - Copy\Python\CA'
. 'C:\Users\DELL\Desktop\Acd - Copy\Python\env\Scripts\Activate.ps1'
& 'C:\Users\DELL\Desktop\Acd - Copy\Python\env\Scripts\python.exe' manage.py migrate
& 'C:\Users\DELL\Desktop\Acd - Copy\Python\env\Scripts\python.exe' manage.py loaddata programs/fixtures/sample_data.json
& 'C:\Users\DELL\Desktop\Acd - Copy\Python\env\Scripts\python.exe' manage.py runserver
```

Open http://127.0.0.1:8000/courses/ after the server starts.
