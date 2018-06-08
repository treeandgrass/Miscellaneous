FROM python:3.6.4

WORKDIR /app

ADD . /app

COPY requirements.txt ./
RUN pip install --trusted-host pypi.python.org -r requirements.txt

ENV FLASK_APP service.py

EXPOSE 80
CMD [ "python", "service.py" ]
