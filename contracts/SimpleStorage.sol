pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract SimpleStorage {

    address public owner;
    uint public creatorCount;
    uint public contentCount;

    constructor() public {

        owner = msg.sender;

    }

    struct Content {

        uint id;
        string contentType;
        string contentHash;
        string description;
        string title;
        string author;
        address authorAddress;
        bool isRemoved;

        //////                ////////
        //should add author _address//
        //////                ////////

    }

    struct Creator {

        uint id;
        string creatorName;
        address creatorAddress;
        uint[] creatorContentId;
        bool isRegistered;

    }

    mapping(uint => Content) public content;
    mapping(address => Creator) public creator;


    function getCreator(address _address) public view returns (Creator memory) {
      return creator[_address];
    }

    function getContent(uint _id) public view returns (Content memory) {
      return content[_id];
    }

    function deleteContent(uint _id, string memory _contentHash, string memory _title) public {

        if(msg.sender == content[_id].authorAddress){

            content[_id].isRemoved = true;

        }
    }

    function restoreContent(uint _id, string memory _contentHash, string memory _title) public {

        if(msg.sender == content[_id].authorAddress){

            content[_id].isRemoved = false;

        }
    }

    function addContent(string memory _name, string memory _contentType, string memory _contentHash, string memory _description, string memory _title) public {

        contentCount++;
        if(creator[msg.sender].isRegistered){

            creator[msg.sender].creatorContentId.push(contentCount);
            content[contentCount] = Content(contentCount, _contentType, _contentHash, _description, _title, _name, msg.sender, false);

        } else {

            creatorCount++;
            uint[] memory _localArray = new uint[](1);
            _localArray[0] = contentCount;
            creator[msg.sender] = Creator(creatorCount, _name, msg.sender, _localArray, true);
            content[contentCount] = Content(contentCount, _contentType, _contentHash, _description, _title, _name, msg.sender, false);

        }

    }

}
