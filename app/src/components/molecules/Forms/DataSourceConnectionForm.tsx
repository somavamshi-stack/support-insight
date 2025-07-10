import { addDataSourceConnection } from "@redux/actions/adminActions";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { adminState, setAdminFlagStatus } from "@redux/slices";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { SnowflakeFormData, YAMLFormData } from "@types";
import { IDLE, LOADING, SUCCESS } from "@constants";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import * as yaml from "js-yaml";
import Swal from "sweetalert2";

export const DataSourceConnectionForm = () => {
    const [formType, setFormType] = useState<"Snowflake" | "YAML">("Snowflake");
    const dispatch = useAppDispatch();
    const { topic_create_status } = useAppSelector(adminState);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        control,
        reset,
        trigger,
        setError,
        clearErrors
    } = useForm<SnowflakeFormData | YAMLFormData>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            account: "",
            username: "",
            password: "",
            yamlContent: "",
            warehouse: "",
            timeout: 120
        }
    });

    const onSubmitHandler: SubmitHandler<SnowflakeFormData | YAMLFormData> = async (data) => {
        try {
            if (formType === "YAML") {
                try {
                    yaml.load((data as YAMLFormData).yamlContent || "");
                } catch (err) {
                    setError("yamlContent", {
                        type: "manual",
                        message: "Invalid YAML syntax"
                    });
                    return;
                }
            }

            await dispatch(addDataSourceConnection(data));
        } catch (error) {
            setError("root.serverError", {
                type: "manual",
                message: "Submission failed. Please try again."
            });
        }
    };

    useEffect(() => {
        if (topic_create_status === SUCCESS) {
            dispatch(setAdminFlagStatus({ topic_create_status: IDLE }));

            reset();
            clearErrors();

            Swal.fire({
                position: "top",
                icon: "success",
                title: "Data source connection created successfully",
                showCloseButton: true,
                showConfirmButton: false,
                timer: 1500
            });
        } else if (topic_create_status === LOADING) {
            return;
        }
    }, [topic_create_status, clearErrors, reset, dispatch]);

    return (
        <>
            {errors.root?.serverError && <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600">{errors.root.serverError.message}</div>}

            <div className="mb-4">
                <label className="flex items-center space-x-4">
                    <input
                        type="radio"
                        name="formType"
                        value="Snowflake"
                        checked={formType === "Snowflake"}
                        onChange={() => {
                            setFormType("Snowflake");
                            clearErrors();
                        }}
                        className="text-color-500 focus:ring-color-500 h-4 w-4"
                    />
                    <span className="text-gray-700">Snowflake</span>
                </label>
                <label className="mt-2 flex items-center space-x-4">
                    <input
                        type="radio"
                        name="formType"
                        value="YAML"
                        checked={formType === "YAML"}
                        onChange={() => {
                            setFormType("YAML");
                            clearErrors();
                        }}
                        className="text-color-500 focus:ring-color-500 h-4 w-4"
                    />
                    <span className="text-gray-700">YAML</span>
                </label>
            </div>

            <form onSubmit={handleSubmit(onSubmitHandler)} className="ml-8">
                {formType === "Snowflake" && (
                    <>
                        <div className="mb-4 grid grid-cols-4 items-center">
                            <label htmlFor="account" className="col-span-1 block text-sm font-medium text-gray-700">
                                Host:
                            </label>
                            <input
                                type="text"
                                id="account"
                                {...register("account", {
                                    required: "Host is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9.-]+$/,
                                        message: "Invalid host format"
                                    }
                                })}
                                placeholder="e.g. xy12345.snowflakecomputing.com"
                                className={`focus:border-color-500 focus:ring-color-500 col-span-3 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 ${
                                    errors.account ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.account && <p className="mt-1 text-sm text-red-500">{errors.account.message}</p>}
                        </div>
                        <div className="mb-4 grid grid-cols-4 items-center">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                User:
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...register("username", {
                                    required: "User is required",
                                    minLength: {
                                        value: 3,
                                        message: "User must be at least 3 characters"
                                    }
                                })}
                                placeholder="JohnSmith"
                                className={`focus:border-color-500 focus:ring-color-500 col-span-3 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 ${
                                    errors.username ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
                        </div>
                        <div className="mb-4 grid grid-cols-4 items-center space-x-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    }
                                })}
                                placeholder="Password"
                                className={`focus:border-color-500 focus:ring-color-500 col-span-3 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 ${
                                    errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <div className="mb-4 grid grid-cols-4 items-center space-x-4">
                            <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700">
                                Warehouse:
                            </label>
                            <input
                                type="text"
                                id="warehouse"
                                {...register("warehouse", {
                                    required: "Warehouse is required"
                                })}
                                placeholder="SAMPLE_WAREHOUSE"
                                className={`focus:border-color-500 focus:ring-color-500 col-span-3 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 ${
                                    errors.warehouse ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.warehouse && <p className="mt-1 text-sm text-red-500">{errors.warehouse.message}</p>}
                        </div>
                        <div className="mb-4 grid grid-cols-4 items-center space-x-4">
                            <label htmlFor="timeout" className="block text-sm font-medium text-gray-700">
                                Timeout (s):
                            </label>
                            <input
                                type="number"
                                id="timeout"
                                {...register("timeout", {
                                    required: "Timeout is required",
                                    min: {
                                        value: 1,
                                        message: "Timeout must be at least 1 second"
                                    }
                                })}
                                placeholder="120"
                                className={`focus:border-color-500 focus:ring-color-500 col-span-3 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-1 ${
                                    errors.timeout ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.timeout && <p className="mt-1 text-sm text-red-500">{errors.timeout.message}</p>}
                        </div>
                    </>
                )}

                {formType === "YAML" && (
                    <div className="mb-4 space-y-1">
                        <label htmlFor="yamlContent" className="block text-sm font-medium text-gray-700">
                            YAML Content:
                        </label>
                        <Controller
                            name="yamlContent"
                            control={control}
                            rules={{
                                required: "YAML content is required",
                                validate: (value) => {
                                    try {
                                        if (!value?.trim()) return "Content cannot be empty";
                                        const parsed = yaml.load(value);
                                        if (typeof parsed !== "object" || parsed === null) {
                                            return "YAML must be an object";
                                        }
                                        return true;
                                    } catch (err) {
                                        return "Invalid YAML syntax";
                                    }
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <div className="relative">
                                    <Editor
                                        height="300px"
                                        defaultLanguage="yaml"
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            trigger("yamlContent");
                                        }}
                                        options={{
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: true,
                                            fontSize: 14,
                                            lineNumbers: "on",
                                            roundedSelection: true,
                                            automaticLayout: true,
                                            formatOnPaste: true,
                                            formatOnType: true
                                        }}
                                        className={`rounded-md border ${
                                            fieldState.error ? "border-red-500" : "border-gray-300"
                                        } shadow-sm focus:ring-1 focus:ring-blue-500`}
                                    />
                                    {fieldState.error && <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="bg-color-500 hover:bg-color-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Connecting..." : "Connect"}
                    </button>
                </div>
            </form>
        </>
    );
};
