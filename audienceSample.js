import express from 'express';
import { createInterface } from 'readline';

const app = express();

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the constant email prefix: ', async (constantEmailPrefix) => {
    rl.question('Enter the number of objects to generate: ', async (numObjectsStr) => {
        const numObjects = parseInt(numObjectsStr, 10);
        
        // Example const values:
        const audienceId = 655001;
        const audienceName = "test";
        const membershipChangedTimestamp = 9022024000;
        const isMember = true;
        const constantMPID = '1234567899';

        const arrayOfObjects = await generateObjectsAsync(audienceId, audienceName, membershipChangedTimestamp, isMember, constantMPID, constantEmailPrefix, numObjects);

        app.get('/', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(arrayOfObjects);
        });

        const PORT = 3004;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        rl.close();
    });
});

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

// Generate an array of objects
async function generateObjectsAsync(audienceId, audienceName, membershipChangedTimestamp, isMember, constantMPID, constantEmailPrefix, numObjects) {
    const predefinedEmails = [
        "rakesh.chotaliya@agilisium.com",
        "nithishkumar.selvakumar@agilisium.com",
        "jeganathan.muthuramalingam@agilisium.com",
        "rahul.babu@agilisium.com",
        "venkateshwaran.shankaranarayanan@agilisium.com",
        "selvam.murugan@agilisium.com"
    ];

    const generatedMPIDs = new Set();
    const generatedEmails = new Set(predefinedEmails);

    const objects = predefinedEmails.map((email, index) => {
        const mpid = constantMPID + pad(index + 1, 6);
        generatedMPIDs.add(mpid);
        return {
            AudienceId: audienceId,
            AudienceName: audienceName,
            MembershipChangedTimestamp: membershipChangedTimestamp,
            IsMember: isMember,
            Identities: {
                MPID: mpid,
                Email: email
            }
        };
    });

    for (let i = predefinedEmails.length; i < numObjects; i++) {
        let mpid, email;
        do {
            mpid = constantMPID + pad(i + 1, 6);
        } while (generatedMPIDs.has(mpid));
        generatedMPIDs.add(mpid);

        do {
            email = constantEmailPrefix + pad(i + 1, 6) + '@mailinator.com';
        } while (generatedEmails.has(email));
        generatedEmails.add(email);

        objects.push({
            AudienceId: audienceId,
            AudienceName: audienceName,
            MembershipChangedTimestamp: membershipChangedTimestamp,
            IsMember: isMember,
            Identities: {
                MPID: mpid,
                Email: email
            }
        });
    }

    return objects;
}