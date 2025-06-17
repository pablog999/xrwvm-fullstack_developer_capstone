FROM python:3.12.0-slim-bookworm

# Ensure Python behaves nicely in Docker
ENV PYTHONBUFFERED=1
ENV PYTHONWRITEBYTECODE=1

# Define the app directory
ENV APP=/app

# Set the working directory inside the container
WORKDIR $APP

# Install system dependencies, including curl
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Copy only the requirements first (for better build caching)
COPY requirements.txt $APP/

# Install Python dependencies
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# Copy the rest of the application files
COPY . $APP/

# Expose the port your app runs on
EXPOSE 8000

# Ensure the entrypoint script is executable
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint script (typically handles migrations, static files, etc.)
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]

# Start Gunicorn to serve Django app
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]