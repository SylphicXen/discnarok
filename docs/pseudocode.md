# Premise

Iterate through all members of a Discord server. Tag members who will be kicked.

To prevent being kicked, someone will need these things:
* Have a certain role
* Be in the server [i]less[/i] than a set amount of time

After all members are tagged, iterate through all tagged members and kick them.
This will be done with a delay such that it does not overload the API.

# Configuration

The bot will be configurable through dotenv to include these configurable things

* API key
* Role ID to check against
* Time in days since member joined before they are purged

# Pseudocode

for members in server
    if member has role
        pass
    else
        if member has been in server more than 30 days
            kick the member