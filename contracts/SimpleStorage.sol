pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
    address public owner;
    uint256 public creatorCount;
    uint256 public contentCount;

    constructor() public {
        owner = msg.sender;
    }

    // Parameters associated with the posted content
    
    struct Content {
        uint256 id;
        string contentType;   // Project, Paper or Article
        string contentHash;   // Content's IPFS hash 
        string description;
        string title;
        string author;
        address authorAddress;
        bool isRemoved;   // Handle to check content's delete status. If deleted, it will be visible only to the author.
    }

    // Parameters associated with an individual author
    
    struct Creator {
        uint256 id;
        string creatorName;
        address creatorAddress;
        uint256[] creatorContentId;
        bool isRegistered;   // handle to check for registered addresses
    }

    mapping(uint256 => Content) public content;
    mapping(address => Creator) public creator;

    // Funtion to fetch individual author's details
    
    function getCreator(address _address) public view returns (Creator memory) {
        return creator[_address];
    }

    function getContent(uint256 _id) public view returns (Content memory) {
        return content[_id];
    }

    // Set delete status as true to make it visible only to the author
    
    function deleteContent(uint256 _id) public payable onlyAuthor(_id) {
        content[_id].isRemoved = true;
    }

    // Set delete status as false to make it publicly visible 
    
    function restoreContent(uint256 _id) public payable onlyAuthor(_id) {
        content[_id].isRemoved = false;
    }

    //Modifier to identify Author.
     
    modifier onlyAuthor(uint256 _id) {
        require(
            msg.sender == content[_id].authorAddress,
            "Only author can call this."
        );
        _;
    }

    // Adds content to the mapping and updates author's details
    
    function addContent(
        string memory _name,
        string memory _contentType,
        string memory _contentHash,
        string memory _description,
        string memory _title
    ) public {
        contentCount++;
        
        // Checks if the content is created by a new author
        
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
