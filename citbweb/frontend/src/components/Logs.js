import React from 'react';

const Logs = ({logs}) => {

    const colorifyLog = (log) => {
        return log.replace(/(\d+B)|(\d+G)|(\d+Y)|(\d+R)/gi, (match) => {
          if (match.endsWith('B')) return `<span style="color: MediumBlue">${match}</span>`;
          if (match.endsWith('G')) return `<span style="color: SeaGreen">${match}</span>`;
          if (match.endsWith('Y')) return `<span style="color: Gold">${match}</span>`;
          if (match.endsWith('R')) return `<span style="color: FireBrick">${match}</span>`;
        });
      };

    return (
        <div className="logs">
            <div key={0} className="log">
                Logs:
            </div>
            <ul className='log-list-x'>
                {[...logs].reverse().map((value, idx) => (
                    <li key={idx} className="log" dangerouslySetInnerHTML={{ __html: colorifyLog(value) }} />
                ))}
            </ul>
        </div>
    );
}

export default Logs;
