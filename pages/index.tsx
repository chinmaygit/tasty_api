import {useState} from 'react';

import Head from 'next/head';
import {XIcon} from '@heroicons/react/solid';
import {PlusIcon} from '@heroicons/react/outline';
import dynamic from 'next/dynamic';
import axios, {Method} from 'axios';

import {Headers, Request, Response} from './api/request';
import KeyValueItem, {KeyValue} from '../components/key_value_item';
import ResponseComponent from '../components/response';

const Editor = dynamic(() => import('../components/json_editor'), {ssr: false});

export default function Home() {
  const [method, setMethod] = useState<Method>('get');
  const [isBody, setIsBody] = useState(false);
  const [body, setBody] = useState<Array<KeyValue>>([]); // [{key: '', value: ''}]
  const [contentType, setContentType] = useState('application/json');
  const [headers, setHeaders] = useState<Array<KeyValue>>([]); // [{key: '', value: ''}]
  const [url, setUrl] = useState('');
  const [requestName, setRequestName] = useState('Untitled request');
  const [editorText, setEditorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<Response>(null);

  function onURLChange(e) {
    setUrl(e.target.value);
  }

  function onRequestNameChange(e) {
    setRequestName(e.target.value);
  }

  function getBody(): object {
    let newBody = {};
    body.forEach((item) => {
      newBody[item.key] = item.value;
    });
    return newBody;
  }

  function getHeaders(): Headers {
    let newHeaders: Headers = {contentType: isBody ? contentType : null};
    headers.forEach((item) => {
      newHeaders[item.key] = item.value;
    });
    return newHeaders;
  }

  async function onSend() {
    let request: Request = {
      url,
      method,
      requestName,
      body: getBody(),
      headers: getHeaders(),
    };
    setResponse(null);
    setIsLoading(true);
    try {
      let response = await axios.post(
        'http://localhost:3000/api/request',
        request
      );
      console.log('RESPONSE', response.data);
      setResponse(response.data);
      setEditorText(JSON.stringify(response.data.body, null, 2));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>EasyPost</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="shadow-lg">
          <div className="flex container mx-auto justify-between items-center p-2  md:justify-start md:space-x-10">
            <a href="#" className="flex flex-row items-center">
              <div className="">
                <img className="h-8 w-auto sm:h-10" src="/icon.svg" alt="" />
              </div>
              <div className="">
                <h1 className="text-2xl">EasyPost</h1>
              </div>
            </a>
          </div>
        </div>

        <div className="container shadow-lg mx-auto my-2 bg-gray-900 rounded-md">
          <ul className="flex">
            <li className="flex-grow-0 flex flex-col">
              <label className="p-4 text-md text-gray-500">METHOD</label>

              <select
                className="bg-black text-gray-500 p-4"
                value={method}
                onChange={(e) => {
                  setMethod(e.target.value as Method);
                  setIsBody(e.target.value !== 'get');
                }}
              >
                <option value="get">GET</option>
                <option value="post">POST</option>
                <option value="put">PUT</option>
                <option value="delete">DELETE</option>
              </select>
            </li>

            <li className="flex-1 flex flex-col">
              <label className="p-4 text-md text-gray-500">URL</label>
              <input
                className="bg-black p-3.5 text-white"
                value={url}
                onChange={onURLChange}
                placeholder="ex:`http://example.com/api/get/something`"
              />
            </li>

            <li className="flex-grow-0 flex flex-col">
              <label className="p-4 text-md text-transparent">ACTION</label>
              <button
                className="p-3 border border-transparent shadow-md text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-indigo-500"
                onClick={onSend}
              >
                Send
              </button>
            </li>
          </ul>

          <ul className="flex">
            <li className="flex-1 flex flex-col">
              <label className="p-4 text-md text-gray-500">Request name</label>
              <input
                className="bg-black p-3.5 text-white"
                placeholder="ex:`Get all something`"
                value={requestName}
                onChange={onRequestNameChange}
              />
            </li>
          </ul>
          {isBody ? (
            <div>
              <ul className="flex">
                <li className="flex-1 flex flex-col">
                  <label className="p-4 text-md text-gray-500">
                    Content type
                  </label>
                  <select
                    className="bg-black text-gray-500 p-4"
                    value={contentType}
                    onChange={(e) => {
                      setContentType(e.target.value);
                    }}
                  >
                    <option value="application/json">application/json</option>
                    <option value="application/x-www-form-urlencoded">
                      application/x-www-form-urlencoded
                    </option>
                  </select>
                </li>
              </ul>

              <ul className="flex">
                <li className="flex-1">
                  <div className="flex-1 flex justify-between items-center">
                    <label className="p-4 text-md text-gray-500">
                      Request body
                    </label>

                    <button
                      className="p-4"
                      style={{borderStyle: 'none'}}
                      onClick={() => {
                        setBody([]);
                      }}
                    >
                      <XIcon className="text-gray-500 h-4 w-4" />
                    </button>
                  </div>
                </li>
              </ul>

              {body.map((item, index) => {
                return (
                  <KeyValueItem
                    key={index + 1}
                    index={index}
                    item={item}
                    onKey={(a) => {
                      let newBody = [...body];
                      newBody[index].key = a;
                      setBody(newBody);
                    }}
                    onValue={(a) => {
                      let newBody = [...body];
                      newBody[index].value = a;
                      setBody(newBody);
                    }}
                    onRemove={() => {
                      let newBody = [...body];
                      newBody.pop();
                      setBody(newBody);
                    }}
                  />
                );
              })}

              <u className="flex m1-1">
                <li className="flex-1 flex-col inline-flex justify-center">
                  <button
                    className="inline-flex p-4 justify-center items-center group group-hover:text-white"
                    style={{borderStyle: 'none'}}
                    onClick={() => {
                      let newBody = [...body];
                      newBody.push({key: '', value: ''});
                      setBody(newBody);
                    }}
                  >
                    <PlusIcon className="h-4 w-4 text-gray-500 group-hover:text-white" />
                    <span
                      className="text-md text-gray-500 group-hover:text-white"
                      style={{borderStyle: 'none'}}
                    >
                      ADD ITEM
                    </span>
                  </button>
                </li>
              </u>
            </div>
          ) : null}
        </div>

        <div className="container shadow-lg mx-auto bg-gray-900 rounded-md">
          <div>
            <ul className="flex">
              <li className="flex-1">
                <div className="flex-1 flex justify-between items-center">
                  <label className="p-4 text-md text-gray-500">Headers</label>

                  <button
                    className="p-4"
                    style={{borderStyle: 'none'}}
                    onClick={() => {
                      setHeaders([]);
                    }}
                  >
                    <XIcon className="text-gray-500 h-4 w-4" />
                  </button>
                </div>
              </li>
            </ul>

            {headers.map((item, index) => {
              return (
                <KeyValueItem
                  key={index + 1}
                  index={index}
                  item={item}
                  onKey={(a) => {
                    let newHeaders = [...headers];
                    newHeaders[index].key = a;
                    setHeaders(newHeaders);
                  }}
                  onValue={(a) => {
                    let newHeaders = [...headers];
                    newHeaders[index].value = a;
                    setHeaders(newHeaders);
                  }}
                  onRemove={() => {
                    let newHeaders = [...headers];
                    newHeaders.pop();
                    setHeaders(newHeaders);
                  }}
                />
              );
            })}

            <u className="flex m1-1">
              <li className="flex-1 flex-col inline-flex justify-center">
                <button
                  className="inline-flex p-4 justify-center items-center group group-hover:text-white"
                  style={{borderStyle: 'none'}}
                  onClick={() => {
                    let newHeaders = [...headers];
                    newHeaders.push({key: '', value: ''});
                    setHeaders(newHeaders);
                  }}
                >
                  <PlusIcon className="h-4 w-4 text-gray-500 group-hover:text-white" />
                  <span
                    className="text-md text-gray-500 group-hover:text-white"
                    style={{borderStyle: 'none'}}
                  >
                    ADD ITEM
                  </span>
                </button>
              </li>
            </u>
          </div>
        </div>

        <ResponseComponent isLoading={isLoading} response={response} />
      </main>
    </div>
  );
}
