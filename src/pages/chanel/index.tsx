import React from 'react';
import { useParams } from 'react-router-dom';
interface Props {
    children?: JSX.Element
}
const ChanelPage: React.FC<Props> = (props) => {
    const {chanelType} = useParams();
  
    return (
        <>chanel: {chanelType}</>
    )
}
export default ChanelPage;