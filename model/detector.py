import torch
from transformers import BertTokenizer, BertForSequenceClassification
import json

# Load the fine-tuned model
model_path = "aga-conflict-resolution"  # Path to the saved model
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# Function to classify text
def classify_text(input_text):
    # Tokenize and prepare input
    inputs = tokenizer(input_text, padding=True, truncation=True, return_tensors="pt")
    
    # Classify text
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_label = torch.argmax(logits, dim=1).item()
    
    # Determine if it's a conflict
    is_conflict = predicted_label == 1  # Assuming label 1 represents a conflict
    
    # Prepare response
    response = "This is a conflict." if is_conflict else "This is not a conflict."
    
    # Create JSON response
    result = {
        "is_conflict": is_conflict,
        "response": response
    }
		print(json.dumps(result, indent=4))

    return result
