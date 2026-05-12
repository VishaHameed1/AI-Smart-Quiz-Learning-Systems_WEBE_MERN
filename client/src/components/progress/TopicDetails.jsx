import React from 'react';

const TopicDetails = ({ topic, mastery }) => {
  const widthStyle = { width: mastery + '%' };
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">{topic}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div className="bg-green-600 h-2.5 rounded-full" style={widthStyle}></div>
      </div>
      <div className="text-sm mt-1">Mastery: {mastery}%</div>
    </div>
  );
};

export default TopicDetails;
