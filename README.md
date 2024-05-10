# tournament-system

This is mainly just a project to gain practical experience a "full-stack" implementation of an app with perstisting data in databases.

## How to run:
- **Cloning repository**
    ```
    git clone https://github.com/AmevinLS/tournament-system
    ```
- **Backend startup**:
    ```
    cd tournament-system/be/app
    pip install requirements.txt
    uvicorn main:app --reload
    ```

- **Frontend startup**:
    ```
    cd tournament-system/fe/tournaments
    npm install
    npm run dev
    ```


## Features include:
- User authentication with password hashing/salting
- User account activation through email


## Technologies
- **React** with Bootstrap components (frontend)
- **FastAPI** with uvicorn, **SQLAlchemy** (backend)
- **MySQL** (relational database)


## Database ER diagram:
![er_diagram](./docs/er_diagram.png)
