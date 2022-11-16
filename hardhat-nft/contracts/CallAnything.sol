//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract CallAnything {

    address public s_someAddress;
    uint256 public s_amount;

    function transfer(address someAddress, uint256 amount) public {
        s_someAddress = someAddress;
        s_amount = amount;
    }

    function getSelectorOne() public pure returns(bytes4 selector) {
        // this refers to 0x543f0891 the transfer function above
        selector = bytes4(keccak256(bytes("transfer(address, uint256")));
    }

    function getDataToCallTransfer(address someAddress, uint256 amount) public pure returns(bytes memory) {
        return abi.encodeWithSelector(getSelectorOne(), someAddress, amount);
    }

    // directly call the transfer function directly with passing params
    function callTransferFunctionDirectly(address someAddress, uint256 amount) public returns(bytes4, bool) {
        // we are going to call encoded data which points us to transfer function with some data
        (bool success, bytes memory returnData) = address(this).call(
        // getDataToCallTransfer(someAddress, amount)
            abi.encodeWithSelector(getSelectorOne(), someAddress, amount)
        );
        return (bytes4(returnData), success);
    }

    // directly call the transfer function directly with passing params
    function callTransferFunctionDirectlySig(address someAddress, uint256 amount) public returns(bytes4, bool) {
        // we are going to call encoded data which points us to transfer function with some data
        (bool success, bytes memory returnData) = address(this).call(
        // getDataToCallTransfer(someAddress, amount)
            abi.encodeWithSignature("transfer(address, uint256", someAddress, amount)
        );
        return (bytes4(returnData), success);
    }
}
