pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
    address public owner;
    uint256 public creatorCount;
    uint256 public contentCount;

    constructor() public {
        owner = msg.sender;
    }

    struct Content {
        uint256 id;
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
        uint256 id;
        string creatorName;
        address creatorAddress;
        uint256[] creatorContentId;
        bool isRegistered;
    }

    mapping(uint256 => Content) public content;
    mapping(address => Creator) public creator;

    function getCreator(address _address) public view returns (Creator memory) {
        return creator[_address];
    }

    function getContent(uint256 _id) public view returns (Content memory) {
        return content[_id];
    }

    function deleteContent(uint256 _id) public payable onlySeller(_id) {
        content[_id].isRemoved = true;
    }

    function restoreContent(uint256 _id) public payable onlySeller(_id) {
        content[_id].isRemoved = false;
    }

    /**
        Modifier to identify Seller / Author.
     */
    modifier onlySeller(uint256 _id) {
        require(
            msg.sender == content[_id].authorAddress,
            "Only seller can call this."
        );
        _;
    }

    function addContent(
        string memory _name,
        string memory _contentType,
        string memory _contentHash,
        string memory _description,
        string memory _title
    ) public {
        contentCount++;
        if (creator[msg.sender].isRegistered) {
            creator[msg.sender].creatorContentId.push(contentCount);
            content[contentCount] = Content(
                contentCount,
                _contentType,
                _contentHash,
                _description,
                _title,
                _name,
                msg.sender,
                false
            );
        } else {
            creatorCount++;
            uint256[] memory _localArray = new uint256[](1);
            _localArray[0] = contentCount;
            creator[msg.sender] = Creator(
                creatorCount,
                _name,
                msg.sender,
                _localArray,
                true
            );
            content[contentCount] = Content(
                contentCount,
                _contentType,
                _contentHash,
                _description,
                _title,
                _name,
                msg.sender,
                false
            );
        }
    }
}
