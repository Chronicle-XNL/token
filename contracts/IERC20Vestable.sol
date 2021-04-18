// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20Vestable {

    function getIntrinsicVestingSchedule(address grantHolder)
    external
    view
    returns (
        uint32 cliffDuration,
        uint32 vestDuration,
        uint32 vestIntervalDays
    );

    function grantVestingTokens(
        address beneficiary,
        uint256 totalAmount,
        uint256 vestingAmount,
        uint32 startDay,
        uint32 duration,
        uint32 cliffDuration,
        uint32 interval
    ) external returns (bool ok);

    function today() external view returns (uint32 dayNumber);

    function vestingForAccountAsOf(
        address grantHolder,
        uint32 onDayOrToday
    )
    external
    view
    returns (
        uint256 amountVested,
        uint256 amountNotVested,
        uint256 amountOfGrant,
        uint32 vestStartDay,
        uint32 cliffDuration,
        uint32 vestDuration,
        uint32 vestIntervalDays
    );

    function vestingAsOf(uint32 onDayOrToday) external view returns (
        uint256 amountVested,
        uint256 amountNotVested,
        uint256 amountOfGrant,
        uint32 vestStartDay,
        uint32 cliffDuration,
        uint32 vestDuration,
        uint32 vestIntervalDays
    );

    event VestingScheduleCreated(
        address indexed vestingLocation,
        uint32 cliffDuration, 
        uint32 indexed duration, 
        uint32 interval);

    event VestingTokensGranted(
        address indexed beneficiary,
        uint256 indexed vestingAmount,
        uint32 startDay,
        address vestingLocation,
        address indexed grantor);
}
