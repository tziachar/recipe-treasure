import React, { useState } from 'react';
import { Treebeard } from 'react-treebeard';


const buildTree = (data) => {
  const map = {};
  data.forEach(node => {
    map[node.termCode] = { ...node, name: `${node.termExtendedName} (${node.termCode})`, children: [] };
  });

  data.forEach(node => {
    if (node.parentCode && map[node.parentCode]) {
      map[node.parentCode].children.push(map[node.termCode]);
    }
  });

  const tree = [];
  data.forEach(node => {
    if (!node.parentCode || !map[node.parentCode]) {
      tree.push(map[node.termCode]);
    }
  });

  return { name: "Foodex catalogues", termCode: "root", children: tree };
};

const collapseTree = (node) => {
  if (node.children) {
    node.children.forEach(child => collapseTree(child));
    node.toggled = false;
  }
};

const TreeComponent = ({ data, onSubmitData, onSubmitFacet }) => {
  const [cursor, setCursor] = useState(null);
  const [treeData, setTreeData] = useState(buildTree(data));


  const onToggle = (node, toggled) => {
    if (cursor && cursor.active) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setTreeData({ ...treeData });
  };

  const handleSelectBaseTerm = () => {
    if (cursor.termType !== "M" && cursor.termType !== "C" && cursor.termType !== "E" && cursor.termType !== "F") {
      alert("This node cannot be selected.");
      return;
    }

    if (cursor) {
      onSubmitData([{
        name: cursor.termExtendedName,
        code: cursor.termCode
      }]);
    }

    collapseTree(treeData);
    setTreeData({ ...treeData });
    setCursor(null);
  };


  const handleSelectFacet = () => {
    if (cursor.termType !== "M" && cursor.termType !== "C" && cursor.termType !== "E" && cursor.termType !== "F") {
      alert("This node cannot be selected.");
      return;
    }
    if (cursor && cursor.facet) {
      const facetCode = `${cursor.facet}.${cursor.termCode}`;
      onSubmitFacet({
        name: cursor.termExtendedName,
        code: facetCode
      });
    } else {
      alert("This node does not have a facet.");
    }

    collapseTree(treeData);
    setTreeData({ ...treeData });
    setCursor(null);
  };

  const customStyles = {
    tree: {
      base: {
        listStyle: 'none',
        backgroundColor: '#333',
        margin: 0,
        padding: 0,
        color: '#9DA5AB',
        fontFamily: 'Lato, sans-serif',
        fontSize: '12px'
      },
      node: {
        base: {
          position: 'relative'
        },
        link: {
          cursor: 'pointer',
          position: 'relative',
          padding: '0 5px',
          display: 'block',
          color: 'white'
        },
        activeLink: {
          background: '#31363F',
          color: 'white'
        },
        toggle: {
          base: {
            position: 'relative',
            display: 'inline-block',
            verticalAlign: 'middle',
            marginLeft: '-5px',
            height: '10px',
            width: '10px'
          },
          wrapper: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            margin: '-7px 0 0 -7px',
            height: '14px'
          },
          height: 10,
          width: 10,
          arrow: {
            fill: '#9DA5AB',
            strokeWidth: 0
          }
        },
        header: {
          base: {
            display: 'inline-block',
            verticalAlign: 'middle',
            color: 'white'
          },
          connector: {
            width: '2px',
            height: '12px',
            borderLeft: 'solid 2px #9DA5AB',
            borderBottom: 'solid 2px #9DA5AB',
            position: 'absolute',
            top: '0px',
            left: '-21px'
          },
          title: {
            lineHeight: '12px',
            verticalAlign: 'middle'
          }
        },
        subtree: {
          listStyle: 'none',
          paddingLeft: '19px'
        },
        loading: {
          color: '#E2C089'
        },
        selectable: {
          backgroundColor: '#dc143c',
          borderRadius: '3px',
          padding: '2px'
        }
      }
    }
  };

  return (
    <div>
      <Treebeard
        data={treeData}
        onToggle={onToggle}
        style={customStyles}
      />
      {cursor && cursor.termCode !== "root" && cursor.termCode !== "all_lists" && (
        <div style={{ fontSize: '12px', padding: '10px', backgroundColor: '#f7f7f7', borderRadius: '5px', marginTop: '10px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Selected Node</h3>
          <p><strong>Term Code:</strong> {cursor.termCode}</p>
          <p><strong>Extended Name:</strong> {cursor.termExtendedName}</p>
          <p><strong>Scope Note:</strong> {cursor.termScopeNote}</p>
          {cursor.facet && <p><strong>Facet:</strong> {cursor.facet}</p>}
          <button onClick={handleSelectBaseTerm} style={{ fontSize: '15px', padding: '3px 8px', marginLeft: '10px', marginRight: '10px', width: '40%'}}>Select Base Term</button>
          <button onClick={handleSelectFacet} style={{ fontSize: '15px', padding: '3px 8px', marginLeft: '10px', marginRight: '10px', width: '40%'}}>Select Facet</button>
        </div>
      )}
      
    </div>
  );
};

export default TreeComponent;