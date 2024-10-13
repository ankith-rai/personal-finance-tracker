#!/usr/bin/env python3.12

import getopt
import os
import platform
import sys


def is_windows():
    return platform.uname().system == 'windows'


def container_exists(name):
    return os.system(f'docker ps -a --format "{{{{.Names}}}}" | grep -q "^{name}$"') == 0


def volume_exists(name):
    return os.system(f'docker volume ls --format "{{{{.Name}}}}" | grep -q "^{name}$"') == 0


def run(reset, reset_db):

    with open('../requirements.txt', 'r') as file:
        requirements = file.read()

    os.environ['_PIP_ADDITIONAL_REQUIREMENTS'] = requirements
    os.environ['AIRFLOW_UID'] = '50000' if is_windows() else str(os.getuid())

    if reset_db:
        if container_exists('airflow-postgres-1'):
            print('Removing existing airflow postgres container')
            if os.system('docker rm airflow-postgres-1') != 0:
                raise Exception('Failed to remove airflow-postgres-1 container')
        if volume_exists('airflow_postgres-db-volume'):
            print('Removing existing postgres-volume')
            if os.system('docker volume rm airflow_postgres-db-volume') != 0:
                raise Exception('Failed to remove airflow postgres volume')

    args = ''
    if reset:
        args += ' --force-recreate'
    sys.exit(os.system(f'docker compose up{args}'))


if __name__=='__main__':
    try:
        options, _ = getopt.getopt(sys.argv[1:], 'rd', ['reset', 'reset-db'])
    except Exception as e:
        print(e)
        sys.exit(1)
    
    reset = False
    reset_db = False

    for name, _ in options:
        if name in ('-r', '--reset'):
            reset = True
        if name in ('-d', '--reset-db'):
            reset_db = True
    
    run(reset, reset_db)
