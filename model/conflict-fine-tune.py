import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
from torch.utils.data import DataLoader, TensorDataset
import torch
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from torch.optim import AdamW

# Load the CSV dataset
data = pd.read_csv("dataset.csv")

# Tokenize the chat text
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
tokenized_inputs = tokenizer(data["chat"].tolist(), padding=True, truncation=True, return_tensors="pt")

# Prepare labels
labels = torch.tensor(data["label"].tolist())

# Prepare the dataset
train_dataset = TensorDataset(
    tokenized_inputs["input_ids"],
    tokenized_inputs["attention_mask"],
    labels
)

# Create data loader
train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)

# Initialize model
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
optimizer = AdamW(model.parameters(), lr=1e-5)

# Training loop
num_epochs = 5
for epoch in range(num_epochs):
    for batch in train_loader:
        input_ids, attention_mask, label = batch
        optimizer.zero_grad()
        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=label)
        loss = outputs.loss
        loss.backward()
        optimizer.step()

# Evaluation
model.eval()
with torch.no_grad():
    predictions = []
    true_labels = []
    for batch in train_loader:
        input_ids, attention_mask, label = batch
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        logits = outputs.logits
        predicted_labels = torch.argmax(logits, dim=1)
        predictions.extend(predicted_labels.tolist())
        true_labels.extend(label.tolist())

# Calculate evaluation metrics
accuracy = accuracy_score(true_labels, predictions)
precision = precision_score(true_labels, predictions)
recall = recall_score(true_labels, predictions)
f1 = f1_score(true_labels, predictions)

print("Accuracy:", accuracy)
print("Precision:", precision)
print("Recall:", recall)
print("F1-Score:", f1)

# Save the fine-tuned model
model.save_pretrained("aga-conflict-resolution")


