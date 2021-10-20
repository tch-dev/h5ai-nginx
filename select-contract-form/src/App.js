import "bootstrap/dist/css/bootstrap.min.css";
import { useRef, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import "./App.scss";
import chains from "./chains";

function App() {
  const [selectedMatch, setSelectedMatch] = useState("full_match");
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState(1);
  const [showValidationResults, setShowValidationResults] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const formRef = useRef();
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
      setShowValidationResults(true);
      return;
    }

    const uri = generateRepoURI(address, chainId, selectedMatch);
    window.location.href = uri;
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    e.target.value
      ? setShowValidationResults(true)
      : setShowValidationResults(false);
    formRef.current.checkValidity()
      ? setIsFormValid(true)
      : setIsFormValid(false);
  };

  const handleSelectMatch = (e) => {
    setSelectedMatch(e.target.value);
  };

  return (
    <div className="App">
      <Card className="card mx-6">
        <div className="px-4 container center text-center column">
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            className="m-2 logo"
            alt="Sourcify logo"
          />
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>
            Contract Repository
          </div>
          <div className="mb-3 text-center">
            {" "}
            Enter the contract details to view source code and metadata{" "}
          </div>
        </div>
        <Form
          noValidate
          validated={showValidationResults}
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <Form.Group className="mt-4" controlId="form-address">
            <Form.Label className="label">Contract Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="0x2fa5b..."
              required
              pattern="0x[a-fA-F0-9]{40}$"
              onChange={handleAddressChange}
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
          <Form.Group className="mt-4" controlId="form-chain">
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
          <Form.Group className="mt-4">
            <Form.Label className="label">Match Type</Form.Label>
            <Form.Check
              className="match-select-container"
              aria-label="select chain"
            >
              {matches.map((match, idx) => (
                <div>
                  <Form.Check.Input
                    id={`match-${idx}`}
                    key={`match-key-${idx}`}
                    value={match.value}
                    type="radio"
                    className="mb-4 me-2 match-radio"
                    checked={selectedMatch === match.value}
                    onChange={handleSelectMatch}
                    onClick={handleSelectMatch}
                  />
                  <Form.Check.Label
                    className={`match-radio ${
                      selectedMatch === match.value ? "selected-radio" : ""
                    }`}
                    htmlFor={`match-${idx}`}
                  >
                    {match.name}
                  </Form.Check.Label>
                </div>
              ))}
            </Form.Check>
          </Form.Group>
          <Button
            className="mt-2"
            variant="primary"
            disabled={!isFormValid}
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
