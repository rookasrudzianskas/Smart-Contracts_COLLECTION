// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Encoding {

    function combineStrings() public pure returns(string memory) {
        // encoding to bytes format
        return string(abi.encodePacked("Hi mom!", "Miss you!"));
        // globally available methods are these
    }

    function encodeNumber() public pure returns(bytes memory) {
        // this says encode this number 1 to its binyry version, so it can interact with it, as it understands
        // hey number 1, make me machine readable
        bytes memory number = abi.encode(1);
        return number;
    }

    function encodeString() public pure returns(bytes memory) {
        bytes memory someString = abi.encode("Some string");
        return someString;
    }

    function encodeStringPacked() public pure returns(bytes memory) {
        bytes memory someString = abi.encodePacked("some string");
        return someString;
    }

    function encodeStringBytes() public pure returns(bytes memory) {
        bytes memory someString = bytes("some String");
        return someString;
    }

    function decodeString() public pure returns(string memory) {
        string memory someString = abi.decode(encodeString(), (string));
        return someString;
    }

    function multiEncode() public pure returns(bytes memory) {
        bytes memory someString = abi.encode("Some string", "it is bigger");
        return someString;
    }

    function multiDecode() public pure returns(string memory, string memory) {
        (string memory someString, string memory someOtherString) = abi.decode(multiEncode(), (string, string));
        return (someString, someOtherString);
    }

    function multiEncodePacked() public  pure returns(bytes memory) {
        bytes memory someString = abi.encodePacked("some string", "it is bigger");
        return someString;
    }

    function multiDecodePacked() public pure returns (string memory) {
        string memory someString = abi.decode(multiEncodePacked(), (string));
        return someString;
    }

    function multiStringCastPacked() public pure returns (string memory) {
        string memory someString = string(multiEncodePacked());
        return someString;
    }
}
