# Gen-AI Pipeline

SamvadAI uses a complex `LangGraph` state machine to guarantee deterministic and highly accurate data processing.

The graph executes sequentially for every incoming complaint.

## Graph Nodes

1. **Classifier Agent**: Determines the high-level category and specific product type using few-shot prompting.
2. **Sentiment Agent**: Assesses the emotional tone of the customer to prioritize handling.
3. **Severity Agent**: Calculates a strict SLA (Service Level Agreement) deadline and assigns priority (Low, Medium, High, Urgent).
4. **Duplicate Detection Agent**: Maps the complaint against existing issues to cluster systemic problems together (e.g. widespread ATM outages).
5. **Draft Response Agent**: Creates a template response for human agents to easily copy, edit, and send, reducing handle time by up to 80%.

## LLM Provider
This project is configured to utilize Google's Gemini 1.5 Flash model for extremely rapid and cost-effective multi-modal processing, via the `langchain-google-genai` integration package.
