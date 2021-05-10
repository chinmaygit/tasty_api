import dynamic from 'next/dynamic';
import {Response} from '../pages/api/request';

const Editor = dynamic(() => import('../components/json_editor'), {ssr: false});
type ResponseComponentProps = {response: Response; isLoading: boolean};

export default function ResponseComponent({
  response,
  isLoading,
}: ResponseComponentProps) {
  if (isLoading)
    return (
      <div className="container shadow-lg mx-auto bg-gray-900 rounded-md mt-2 p-4">
        <label className="text-lg text-gray-300">LOADING...</label>
      </div>
    );

  if (response !== null)
    return (
      <div className="container shadow-lg mx-auto bg-gray-900 rounded-md mt-2">
        <ul className="flex">
          <li className="flex-1 flex flex-col">
            <label className="p-4 text-md text-gray-500">Response</label>
            <div className="ml-2 mr-2 mb-2">
              <Editor
                text={JSON.stringify(response.body, null, 2)}
                mode={'code'}
                history={false}
                mainMenuBar={false}
                indentation={4}
              />
            </div>
          </li>
          <li className="flex-1 flex flex-col">
            <label
              className={`p-4 text-md ${
                response.status > 199 && response.status < 300
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              STATUS: {response.status}
            </label>
            <label className="text-md p-4 text-gray-200">Headers</label>
            <span className="text-md px-4 text-gray-500">
              content-type : {response.headers['content-type']}
            </span>
            <span className="text-md px-4 text-gray-500">
              cache-control : {response.headers['cache-control']}
            </span>
            <span className="text-md px-4 text-gray-500">
              pragma : {response.headers['pragma']}
            </span>
            <span className="text-md px-4 text-gray-500">
              expires : {response.headers['expires']}
            </span>
          </li>
        </ul>
      </div>
    );

  return null;
}
