"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BiCheck, BiCopy, BiKey, BiPlus, BiX } from "react-icons/bi";
import axios from "axios";
import { CodeBlock, dracula } from "react-code-blocks";
import { CgCopy, CgEye, CgPassword } from "react-icons/cg";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

interface IntegrationKey {
  _id: string;
  for: string;
  key: string;
}

const Integrations: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId;
  const token = localStorage.getItem("authToken");

  const [integrationKeys, setIntegrationKeys] = useState<IntegrationKey[]>([]);
  const [expandGenerateKey, setExpandGenerateKey] = useState(false);
  const [newKeyFor, setNewKeyFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing integration keys
  useEffect(() => {
    if (projectId) {
      fetchIntegrationKeys();
    }
  }, [projectId]);

  const fetchIntegrationKeys = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${projectId}/integration-keys`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIntegrationKeys(response.data.integrationKeys || []);
    } catch (err) {
      console.error("Error fetching integration keys:", err);
      setError("Failed to fetch integration keys.");
    }
  };

  // Handle new key generation
  const generateIntegrationKey = async () => {
    if (!newKeyFor.trim()) {
      setError("Key description is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${projectId}/generate-integration-key`,
        { keyFor: newKeyFor },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new key to the list and reset input
      const newKey = response.data.key;
      if (newKey) {
        setIntegrationKeys((prevKeys) => [...prevKeys, newKey]);
      }
      setNewKeyFor("");
      setExpandGenerateKey(false);
      fetchIntegrationKeys();
    } catch (err) {
      console.error("Error generating integration key:", err);
      setError("Failed to generate a new key.");
    } finally {
      setLoading(false);
    }
  };

  // Handle integration key deletion
  const deleteIntegrationKey = async (keyId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/${projectId}/integration-key/${keyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the key from the list
      setIntegrationKeys((prevKeys) =>
        prevKeys.filter((key) => key._id !== keyId)
      );
    } catch (err) {
      console.error("Error deleting integration key:", err);
      setError("Failed to delete the key.");
    } finally {
      setLoading(false);
    }
  };

  const reactIframeUrl =
    "{FORMS_DEPLOY_URL}/projects/${projectId}/form/by-title/${form_title}";

  return (
    <div className=" p-4 relative">
      <div className=" border bg-gray-50/60 border-gray-100 p-4 rounded-xl">
        <p className="uppercase text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <BiKey size={20} />
          Integration Keys
        </p>
        {expandGenerateKey && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter description (e.g., admin integration)"
              value={newKeyFor}
              onChange={(e) => setNewKeyFor(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={generateIntegrationKey}
              disabled={loading}
              className={`flex items-center gap-1 bg-blue-600 text-white rounded-full px-4 py-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <BiCheck />
              {loading ? "Generating..." : "Save"}
            </button>
            <button
              onClick={() => {
                setExpandGenerateKey(false);
                setNewKeyFor("");
              }}
              className="flex items-center gap-1 bg-gray-300 rounded-full px-4 py-2"
            >
              <BiX />
              Cancel
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {integrationKeys.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-4 ">
            {integrationKeys.map((key) => (
              <div
                key={key._id}
                className="bg-gray-100 flex items-center p-3 justify-between rounded-lg "
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium italic text-gray-700">
                    For:
                  </p>
                  <p className="text-sm font-medium"> {key.for}</p>
                </div>
                <div className="p-2 border border-gray-100 bg-white rounded flex items-center gap-2">
                  <div className="flex items-cente gap-2 pl-2 pr-4 border-r">
                    <p className="text-xs">Key: </p>
                    <p className=" text-sm font-bold ">
                      {key.key.replace(/.(?=.{4})/g, "*")}
                    </p>
                  </div>
                  <div className="flex ">
                    <CgEye
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded-md hover:text-blue-600"
                      title="Show Key"
                      onClick={() => alert(`Key: ${key.key}`)} // Replace with a secure method to show the key
                      size={32}
                    />
                    <CgCopy
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded-md hover:text-blue-600"
                      title="Copy Key"
                      onClick={() => navigator.clipboard.writeText(key.key)}
                      size={32}
                    />
                    <BiX
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded-md hover:text-red-600"
                      title="Revoke Key"
                      onClick={() => deleteIntegrationKey(key._id)}
                      size={32}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No integration keys available.</p>
        )}
        <div className="mt-8 border bg-gray-50/60 border-gray-100 p-4 rounded-xl flex gap-2 flex-col">
          <p className="uppercase text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2 ">
            <CgPassword size={20} />
            Environment Variables
          </p>
          <div className="flex text-sm items-center gap-4">
            <p className="text font-medium">FORMS_DEPLOY_URL</p>
            <p className=" border bg-white p-2 rounded-md">
              {window.location.protocol}/{window.location.host}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border bg-gray-50/60 border-gray-100 p-4 rounded-xl flex justify-between">
        <div className="">
          <p className="uppercase text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2 ">
            <MdOutlineIntegrationInstructions size={20} />
            Instructions for panel integration
          </p>
          <ol className="list-decimal list-inside my-4 space-y-4 text-gray-600 ">
            <li>Create a route where you want to integrate this panel.</li>
            <li>
              Include the following code in the component rendered on that
              route.
            </li>
            <li>
              Generate an integration key and add it to the code provided below.
            </li>
            <li>
              Save the integration key in your project's{" "}
              <code className="bg-gray-100 text-black p-1 px-2 border border-gray-300 rounded">
                .env
              </code>{" "}
              file as{" "}
              <code className="bg-gray-100 text-black p-1 px-2 border border-gray-300 rounded">
                INTEGRATION_KEY
              </code>
              .
            </li>
            <li>
              Save the deployment URL in your project's <code>.env</code> file
              as{" "}
              <code className="bg-gray-100 text-black p-1 px-2 border border-gray-300 rounded">
                FORMS_DEPLOY_URL
              </code>
              .
            </li>
          </ol>
        </div>
        <div className="h-[25rem] w-[60%] overflow-y-auto rounded-xl">
          <CodeBlock
            text={`
       "use client";
       import React, { useRef } from "react";
       
       const TestPage: React.FC = () => {
         const iframeRef = useRef<HTMLIFrameElement>(null);
       
         // Key to send to the child iframe
         const keyToSend = process.env.INTEGRATION_KEY;
       
         // Send the key to iframe when the iframe is loaded
         const handleIframeLoad = () => {
             iframeRef!.current!.contentWindow?.postMessage(
               { type: "SET_KEY", key: keyToSend },
               "*"
             );
         };
       
         return (
           <div>
             <iframe
               ref={iframeRef}
               src="process.env.FORMS_DEPLOY_URL/projects/${projectId}/form"
               className="w-screen h-screen"
               title="Embedded Form"
               onLoad={handleIframeLoad} // Trigger the function after iframe is loaded
             ></iframe>
           </div>
         );
       };
       
       export default TestPage;
       
          `}
            language={"jsx"}
            showLineNumbers={true}
            theme={dracula}
          />
        </div>
      </div>
      <div className="mt-8 border bg-gray-50/60 border-gray-100 p-4 rounded-xl flex justify-between">
        <div className="">
          <p className="uppercase text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2 ">
            <MdOutlineIntegrationInstructions size={20} />
            Instructions for Forms Integration
          </p>
          <ol className="list-decimal list-inside my-4 space-y-4 text-gray-600 ">
            <li>Add PROJECT_ID to .env</li>
            <li>
              Create a route in your react project with href:
              <code className="bg-gray-100 text-black p-1 px-2 border border-gray-300 rounded">
                "forms/:form_title"
              </code>
            </li>
            <li>
              Create a component and insert this code in it, and render it on
              the url
              <code className="bg-gray-100 text-black p-1 px-2 border border-gray-300 rounded">
                "forms/:form_title"
              </code>
            </li>
          </ol>
        </div>
        <div className="h-[25rem] w-[60%] overflow-y-auto rounded-xl">
          <CodeBlock
            text={`
              import { useParams } from "react-router-dom";

const Forms = () => {
  const { form_title } = useParams();
  const projectId = proces.env.PROJECT_ID;
  return (
    <div className=" overflow-hidden w-screen h-screen">
      {/* {form_title} */}
      <iframe
        className=" w-full h-full overflow-hidden"
        src={"${reactIframeUrl}"}
      ></iframe>
    </div>
  );
};

export default Forms;

              `}
            language={"jsx"}
            showLineNumbers={true}
            theme={dracula}
          />
        </div>
      </div>

      <div className="fixed bg-white h-[3.5rem] border-t w-screen bottom-0 flex justify-end items-center pr-12">
        <button
          onClick={() => setExpandGenerateKey(true)}
          className="flex items-center gap-1 bg-blue-600 text-white text-sm rounded-full px-4 py-2"
        >
          <BiKey />
          Generate New Key
        </button>
      </div>
    </div>
  );
};

export default Integrations;
