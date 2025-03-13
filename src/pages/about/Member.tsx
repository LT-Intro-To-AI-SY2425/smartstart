import React from 'react'
const Member = (props: { image: string; name: string; position: string }) => (
    <li className='flex items-center gap-4'>
        <img alt='' src={props.image} className='size-12 rounded-full' />
        <div className='text-sm/6'>
            <h3 className='font-medium'>{props.name}</h3>
            <p className='text-gray-500'>{props.position}</p>
        </div>
    </li>
);
export default Member;