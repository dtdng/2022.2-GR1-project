from email.policy import default
from sqlalchemy import Column, Integer, String, Date, Time
from db.database import Base


class roles(Base):
    __tablename__ = 'roles'

    role_id = Column(Integer, primary_key=True)
    role_name = Column(String)


class accounts(Base):
    __tablename__ = 'accounts'

    account_id = Column(Integer, primary_key=True)
    role_id = Column(Integer)
    username = Column(String)
    password = Column(String)

    # def __init__:


class Manager(Base):
    __tablename__ = 'manager'

    id_manager = Column(Integer, primary_key=True)
    email = Column(String)
    account_id = Column(Integer)


class Employee(Base):
    __tablename__ = 'employee'

    id_employee = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    account_id = Column(Integer)


class Projects(Base):
    __tablename__ = 'projects'

    id_project = Column(Integer, primary_key=True)
    name_project = Column(String)
    create_time = Column(Date)
    description = Column(String)


class project_status(Base):
    __tablename__ = 'project_status'

    id_project = Column(Integer, primary_key=True)
    status = Column(String)


class project_description(Base):
    __tablename__ = 'project_description'

    id_project = Column(Integer, primary_key=True)
    type = Column(String, primary_key=True)
    description = Column(String)


class task(Base):
    __tablename__ = 'task'

    id_task = Column(Integer, primary_key=True)
    id_project = Column(Integer)
    create_time = Column(Date)
    id_employee = Column(Integer)
    description = Column(String)


class task_status(Base):
    __tablename__ = 'task_status'

    id_task = Column(Integer, primary_key=True)
    status = Column(String)


class workflow_record(Base):
    __tablename__ = 'workflow_record'

    id_workflow = Column(Integer, primary_key=True)
    id_project = Column(Integer)
    status = Column(String)
    execute_time = Column(String)


class workflow_description(Base):
    __tablename__ = 'workflow_description'

    phase = Column(Integer, primary_key=True)
    description = Column(String)
    id_project = Column(Integer, primary_key=True)


class logfile(Base):
    __tablename__ = 'logfile'

    id_workflow = Column(Integer, primary_key=True)
    phase = Column(Integer, primary_key=True)
    type = Column(String, primary_key=True)
    log_description = Column(String)
