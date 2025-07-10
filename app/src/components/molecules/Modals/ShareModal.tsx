import React, { useState } from "react";

import { Button, InputField, TextArea } from "@atoms";
import styles from "./ShareModal.module.css";

export interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [format, setFormat] = useState<"pdf" | "ppt">("pdf");
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleSend = async () => {
        // 1) Call our new /api/share-dashboard route
        try {
            const response = await fetch("/api/share-dashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, format, message })
            });
            if (response.ok) {
                alert("Dashboard shared successfully!");
            } else {
                alert("Failed to share dashboard");
            }
        } catch (err) {
            console.error("Error sending share request:", err);
            alert("Error sending share request.");
        } finally {
            onClose();
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
                <h2>Share Dashboard</h2>
                {/* Email */}
                <InputField
                    label="Email List"
                    description="Recipient's email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Format (Radio Buttons) */}
                <div className={styles.radioGroup}>
                    <label>
                        <input type="radio" name="format" value="pdf" checked={format === "pdf"} onChange={() => setFormat("pdf")} />
                        PDF
                    </label>
                    <label>
                        <input type="radio" name="format" value="ppt" checked={format === "ppt"} onChange={() => setFormat("ppt")} />
                        PowerPoint
                    </label>
                </div>

                {/* Optional message */}
                <TextArea rows={3} placeholder="Optional message..." value={message} onChange={(e) => setMessage(e.target.value)} />

                {/* Actions */}
                <div className={styles.actions}>
                    <Button label="Cancel" variant="secondary" onClick={onClose} />
                    <Button label="Send" variant="primary" onClick={handleSend} />
                </div>
            </div>
        </div>
    );
};
