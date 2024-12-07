# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code and static files to the container
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8080

# Command to run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
