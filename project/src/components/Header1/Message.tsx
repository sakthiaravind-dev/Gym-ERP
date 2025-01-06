import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import StatGroup from './StatGroupTop';
import { Users } from "lucide-react";

const Message: React.FC = () => {
  const [messageType, setMessageType] = useState<string>("activeMembers");
  const [message, setMessage] = useState<string>("");
  const [individualNumber, setIndividualNumber] = useState<string>("");
  const cardConfig = [
    { title: "TOTAL MESSAGE LEFT", value: "0", Icon: Users, path: "/messagedetails" },
  ];

  const handleSendSms = () => {
    if (messageType === "activeMembers") {
      console.log("Sending to Active Members:", message);
    } else {
      console.log("Sending to:", individualNumber, "Message:", message);
    }
    setMessage(""); // Reset the message field
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1250, margin: "0 auto" }}>
      <StatGroup stats={cardConfig} />
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom style={{color: "#71045f" }}>
          Send SMS
        </Typography>

        <FormControl fullWidth margin="normal">
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "normal", fontSize: 13, color: "#71045f" }}>
              Message send to 
            </label>
          <Select
            labelId="message-type-label"
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
          >
            <MenuItem value="activeMembers">Active Members (741)</MenuItem>
          </Select>
        </FormControl>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "normal", fontSize: 13, color: "#71045f" }}>
              Message 
            </label>
        <TextField
          label="Message"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Typography sx={{ marginBottom: 2 }} style={{color: "#71045f"}}>
          Total Characters: {message.length}
        </Typography>

        
        <Button
          variant="contained"
          style={{backgroundColor: "#2485bd", color: "#fff"}}
          onClick={handleSendSms}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom style={{color: "#71045f" }}>
          Send Individual Message
        </Typography>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "normal", fontSize: 13, color: "#71045f" }}>
              Message send to
            </label>

        <TextField
          label="Enter the Number to Send"
          fullWidth
          margin="normal"
          value={individualNumber}
          onChange={(e) => setIndividualNumber(e.target.value)}
        />
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "normal", fontSize: 13, color: "#71045f" }}>
              Message 
            </label>

        <TextField
          label="Message"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Typography sx={{ marginBottom: 2 }} style={{color: "#71045f"}}>
          Total Characters: {message.length}
        </Typography>

        <Button
          variant="contained"
          style={{backgroundColor: "#2485bd", color: "#fff"}}
          onClick={handleSendSms}
          disabled={!message.trim() || !individualNumber.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>

  );
};

export default Message;