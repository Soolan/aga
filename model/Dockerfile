# Use a base image with Python and PyTorch
FROM pytorch/pytorch:latest

# Set the working directory
WORKDIR /app

# Copy your model files to the container
COPY ./* /app/

# Install Python dependencies
RUN pip install -r requirements.txt

# Expose a port if needed
EXPOSE 8080

# Define how to start your model service
CMD ["python", "conflict-fine-tune.py"]

