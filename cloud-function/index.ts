exports.handleConflict = functions.https.onCall(async (data, context) => {
  // Execute SSH command to trigger Python script on Compute Engine.
  // const command = "ssh sohail2d@34.135.162.8 python ./detector.py";
  try {
    // Replace with your Compute Engine instance's public IP or hostname
    const instanceIP = "compute-engine-instance";

    // Replace with the path to your Python script on the instance
    const scriptPath = "./detector.py";

    // The input text to pass to the Python script
    const inputText = data.sentence;

    // SSH command to execute the Python script on the Compute Engine instance
    const command = `ssh user@${instanceIP} python ${scriptPath} '${inputText}'`;

    // Execute the command
    const result = await exec(command);

    // Convert the stdout (a Readable stream) to a string
    const stdoutString = result.stdout?.toString() || "";

    // Parse the JSON response
    const response = JSON.parse(stdoutString);
    console.log(response);

    // Save the response to Firestore
    await admin.firestore()
        .collection("aga-chats")
        .add({
          who: 0,
          timestamp: Date.now(),
          text: response.response,
        });

    return response;
  } catch (error) {
    console.error("Error:", error);
    throw new functions.https.HttpsError("internal", "An error occurred while processing the request.");
  }
});

