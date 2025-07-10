import { Button, InputField } from "@atoms";
import { useEffect, useState } from "react";

interface SaveDashboardFormProps {
    mode: "create" | "update";
    initialData?: { name: string; description: string };
    onClose: () => void;
    onSubmit: (formData: { name: string; description: string }) => void;
    submitButtonLabel?: string;
}

export const SaveDashboardForm = ({
    mode,
    initialData,
    onClose,
    onSubmit,
    submitButtonLabel = mode === "create" ? "Save" : "Update"
}: SaveDashboardFormProps) => {
    const [dashboardName, setDashboardName] = useState(initialData?.name || "");
    const [dashboardDesc, setDashboardDesc] = useState(initialData?.description || "");
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    useEffect(() => {
        if (initialData) {
            setDashboardName(initialData.name);
            setDashboardDesc(initialData.description);
        }
    }, [initialData]);

    const onSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        // Validate name
        if (!dashboardName.trim()) {
            newErrors.name = "Dashboard name is required.";
        } else if (dashboardName.trim().length < 3) {
            newErrors.name = "Dashboard name must be at least 3 characters.";
        }
        // Validate description
        if (mode === "create" && !dashboardDesc.trim()) {
            newErrors.description = "Dashboard description is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // If validation passes
        setErrors({});
        onSubmit({ name: dashboardName.trim(), description: dashboardDesc.trim() });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDashboardName(e.target.value);
        if (errors.name) {
            setErrors((prev) => ({ ...prev, name: undefined }));
        }
    };

    const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDashboardDesc(e.target.value);
        if (errors.description) {
            setErrors((prev) => ({ ...prev, description: undefined }));
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={onSubmitHandler}>
                <div className="mb-2 w-full items-center">
                    <InputField
                        label="Name"
                        description="Dashboard Name"
                        placeholder="Enter dashboard name"
                        type="input"
                        value={dashboardName}
                        onChange={handleNameChange}
                    />
                    {errors.name && <p className="-mt-3 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="mb-2 items-center">
                    <InputField
                        label="Description"
                        description="Dashboard description"
                        placeholder="Enter dashboard description"
                        type="input"
                        value={dashboardDesc}
                        onChange={handleDescChange}
                    />
                    {errors.description && <p className="-mt-3 text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                    <Button label="Cancel" onClick={onClose} className="bg-[#AE3020]" />
                    <Button label={submitButtonLabel} variant="primary" type="submit" />
                </div>
            </form>
        </div>
    );
};
