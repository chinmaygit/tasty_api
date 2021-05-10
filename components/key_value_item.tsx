import {Key} from 'react';
import {XIcon, TrashIcon} from '@heroicons/react/solid';

export type KeyValue = {key: string; value: any};
export type OnKeyValue = (a: string) => void;
export type OnRemove = () => void;

type KeyValueItemProps = {
  index: number;
  item: KeyValue;
  onKey: OnKeyValue;
  onValue: OnKeyValue;
  onRemove: OnRemove;
};

export default function KeyValueItem({
  index,
  item,
  onKey,
  onValue,
  onRemove,
}: KeyValueItemProps) {
  return (
    <ul key={index + 1} className="flex flex-row">
      <li className="inline-flex flex-1 justify-center border border-dashed border-gray-600">
        <input
          className="bg-black p-3.5 text-white flex-1"
          value={item.key}
          onChange={(e) => {
            onKey(e.target.value);
          }}
          placeholder={`key ${index + 1}`}
        />
      </li>

      <li className="inline-flex flex-1 justify-center border border-dashed border-l-0 border-gray-600">
        <input
          className="bg-black p-3.5 text-white flex-1"
          value={item.value}
          onChange={(e) => {
            onValue(e.target.value);
          }}
          placeholder={`value ${index + 1}`}
        />
      </li>

      <li className="justify-center border border-dashed border-l-0 border-gray-600">
        <button
          className="p-5 bg-black"
          style={{borderStyle: 'none'}}
          onClick={onRemove}
        >
          <TrashIcon className="text-gray-500 h-5 w-5" />
        </button>
      </li>
    </ul>
  );
}
