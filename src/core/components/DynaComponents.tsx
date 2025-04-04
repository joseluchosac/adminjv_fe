import React from 'react';
import { 
  FaBars, 
  FaChevronDown, 
  FaEdit, 
  FaEllipsisV, 
  FaHome, 
  FaMoon, 
  FaRegCircle, 
  FaSortDown, 
  FaSun, 
  FaTrash, 
  FaUser,
  FaToggleOff,
  FaToggleOn,
  FaStore,
  FaBoxes,
  FaLock,
  FaEnvelope,
  FaWarehouse,
  FaHandHoldingUsd,
  FaFileAlt,
} from 'react-icons/fa';
import { FaArrowDownAZ, FaArrowDownZA, FaCircleXmark, FaFileInvoice } from 'react-icons/fa6';
import { GrShieldSecurity } from 'react-icons/gr';
import { HiCash } from 'react-icons/hi';
import { LuRectangleEllipsis } from 'react-icons/lu';
import { MdPointOfSale } from 'react-icons/md';
import { TbBriefcase2Filled } from 'react-icons/tb';

export const iconsMap: { [key: string]: React.FC<any> } = {
  FaHome,
  FaMoon,
  FaRegCircle,
  FaSun,
  FaChevronDown,
  FaArrowDownAZ,
  FaArrowDownZA,
  FaSortDown,
  FaUser,
  FaBars,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaCircleXmark,
  FaToggleOff,
  FaToggleOn,
  MdPointOfSale,
  GrShieldSecurity,
  FaStore,
  FaBoxes,
  TbBriefcase2Filled,
  HiCash,
  FaLock,
  FaEnvelope,
  LuRectangleEllipsis,
  FaWarehouse,
  FaFileInvoice,
  FaHandHoldingUsd,
  FaFileAlt,
};

interface Props { 
  name: string; 
  className?: string; 
  style?: any; 
}

const DynaIcon: React.FC<Props> = (props) => {
  const Component = iconsMap[props.name];

  return (
    <>
      {
        Component 
        ? <Component {...props} /> 
        : <div {...props}></div>}
    </>
  );
};

export default DynaIcon;
