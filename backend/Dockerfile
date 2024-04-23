FROM python:3.12-alpine

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8080

ENTRYPOINT ["sh", "entrypoint.sh"]

