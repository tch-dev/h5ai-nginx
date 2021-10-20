import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import "./App.css";
import chains from "./chains";

function App() {
  const [selectedMatch, setSelectedMatch] = useState("full_match");
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState(1);
  const [validated, setValidated] = useState(false);

  const matches = [
    { name: "Full Match", value: "full_match" },
    { name: "Partial Match", value: "partial_match" },
  ];

  const generateRepoURI = (address, chainId, match) => {
    return `/contracts/${match}/${chainId}/${address}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const uri = generateRepoURI(address, chainId, selectedMatch);
    window.location.href = uri;
  };

  return (
    <div className="App">
      <Card className="card">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="mb-3">
            {" "}
            Enter the contract details you want to see{" "}
          </div>
          <Form.Group className="mb-3" controlId="form-address">
            <Form.Label className="label">Contract Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="0x2fa5b..."
              required
              pattern="0x[a-fA-F0-9]{40}$"
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid address
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="form-chain">
            <Form.Label className="label">Chain</Form.Label>
            <Form.Select
              aria-label="select chain"
              onChange={(e) => setChainId(e.target.value)}
            >
              {chains.map((chainObj, i) => {
                return (
                  <option key={`chain-option-${i}`} value={chainObj.id}>
                    {" "}
                    {chainObj.label}{" "}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 match-select-container">
            {matches.map((match, idx) => (
              <Button
                key={idx}
                id={`match-${idx}`}
                type="radio"
                variant={
                  selectedMatch === match.value ? "primary" : "outline-primary"
                }
                name="matches"
                value={match.value}
                checked={selectedMatch === match.value}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedMatch(e.currentTarget.value);
                }}
              >
                {match.name}
              </Button>
            ))}
          </Form.Group>
          <Button
            variant="success"
            type="submit"
            size="lg"
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default App;
