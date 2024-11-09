import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from './contract/ethereumconfig';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom'; // For reading URL query parameters
import './Verifier.css';

const Verifier = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [certificateDetails, setCertificateDetails] = useState({});
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(new Web3(Web3.givenProvider));

  // Get certificateId from the URL query string using useLocation from react-router-dom
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const certificateIdFromURL = queryParams.get('certificateId');

  // Set certificateId from URL if available
  useEffect(() => {
    if (certificateIdFromURL) {
      setCertificateId(certificateIdFromURL);
      handleCertificateVerification(certificateIdFromURL); // Trigger verification automatically if certificateId is in URL
    }
  }, [certificateIdFromURL]);

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWeb3(new Web3(window.ethereum));
      } catch (error) {
        console.error('Connection to MetaMask failed:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this DApp.');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  // Verify certificate ID on the blockchain
  const handleCertificateVerification = async (id) => {
    if (!id) {
      setValidationMessage('Please enter a valid Certificate ID!');
      return;
    }
    setLoading(true);
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const isValid = await contract.methods.isVerified(id).call();

      if (isValid) {
        setValidationMessage('Certificate validated successfully!');
        const certificateData = await contract.methods.getCertificate(id).call();
        setCertificateDetails({
          uid: certificateData[0],
          candidateName: certificateData[1],
          courseName: certificateData[2],
          orgName: certificateData[3],
          cgpa: certificateData[4],
          ipfsHash: certificateData[5],
        });
      } else {
        setValidationMessage('Invalid Certificate! Certificate might be tampered.');
      }
    } catch (error) {
      setValidationMessage('Error validating certificate. Please try again.');
    }
    setLoading(false);
  };

  // Generate PDF of certificate details
  const generateCertificatePDF = () => {
    const doc = new jsPDF();
    doc.text("Certificate Details", 10, 10);
    doc.text(`UID: ${certificateDetails.uid}`, 10, 20);
    doc.text(`Candidate Name: ${certificateDetails.candidateName}`, 10, 30);
    doc.text(`Course Name: ${certificateDetails.courseName}`, 10, 40);
    doc.text(`Organization: ${certificateDetails.orgName}`, 10, 50);
    doc.text(`CGPA: ${certificateDetails.cgpa}`, 10, 60);
    doc.text(`IPFS Hash: ${certificateDetails.ipfsHash}`, 10, 70);
    doc.save("certificate_details.pdf");
  };

  return (
    <div className="container">
      <h2 className="title">Verifier: Validate Certificate</h2>

      {/* Connect to MetaMask */}
      <div className="section">
        <button onClick={connectMetaMask} className="button">
          {account ? `Connected: ${account}` : 'Connect MetaMask'}
        </button>
      </div>

      {/* Verify Certificate via Certificate ID (URL or manual input) */}
      <div className="section">
        <h3>Verify Certificate using Certificate ID</h3>

        {certificateId ? (
          <div>
            <p>Verifying Certificate with ID: {certificateId}</p>
            <button onClick={() => handleCertificateVerification(certificateId)} className="button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Certificate ID'}
            </button>
          </div>
        ) : (
          <div>
            {/* Input field to verify certificate by ID manually */}
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="input-field"
            />
            <button onClick={() => handleCertificateVerification(certificateId)} className="button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Certificate ID'}
            </button>
          </div>
        )}

        {validationMessage && <p className="validation-message">{validationMessage}</p>}
      </div>

      {/* Display and download certificate details */}
      {certificateDetails.uid && (
        <div className="certificate-details">
          <h3>Certificate Details:</h3>
          <p>UID: {certificateDetails.uid}</p>
          <p>Candidate Name: {certificateDetails.candidateName}</p>
          <p>Course Name: {certificateDetails.courseName}</p>
          <p>Organization: {certificateDetails.orgName}</p>
          <p>CGPA: {certificateDetails.cgpa}</p>
          <p>IPFS Hash: {certificateDetails.ipfsHash}</p>
          <button onClick={generateCertificatePDF} className="button">Download Certificate Details as PDF</button>
        </div>
      )}
    </div>
  );
};

export default Verifier;
