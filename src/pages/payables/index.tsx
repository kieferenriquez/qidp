import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Grid, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
// import { API, Storage } from "aws-amplify";
// import { createExpenseImage } from "@/graphql/mutations";
// import config from "../../aws-exports";
import {
  TextractClient,
  AnalyzeExpenseCommand,
} from "@aws-sdk/client-textract";
import {
  TextractExpense,
  ApiAnalyzeExpenseResponse,
} from "amazon-textract-response-parser";

function Payables({ secrets }) {
  const textractClient = new TextractClient({
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: secrets.id,
      secretAccessKey: secrets.key,
    },
  });
  async function onChangeFile(event: any) {
    event.stopPropagation();
    event.preventDefault();

    // Image File
    var imageFile = event.target.files[0];

    // Upload to S3
    // ** Random name for now
    // const uploadedImageFile = await Storage.put(imageFile.name, imageFile);

    // Update Graphql
    // try {
    //   const newExpenseImage = await API.graphql({
    //     query: createExpenseImage,
    //     variables: {
    //       input: {
    //         name: imageFile.name,
    //         userId: "ssss",
    //         image: {
    //           region: config.aws_user_files_s3_bucket_region,
    //           bucket: config.aws_user_files_s3_bucket,
    //           key: uploadedImageFile.key,
    //         },
    //       },
    //     },
    //   });

    //   console.log("Success Graphql", newExpenseImage);
    // } catch (e) {
    //   console.log("Error Graphql", e);
    // }

    // Call Textract
    callTextract(imageFile);
  }

  async function callTextract(file: any) {
    // Read the input file as a blob
    const reader = new FileReader();

    reader.onload = async function () {
      const fileBytes = new Uint8Array(reader.result);

      const textractResponse = await textractClient.send(
        new AnalyzeExpenseCommand({
          Document: {
            Bytes: fileBytes,
          },
        })
      );

      // parse textract
      parseTextract(textractResponse as unknown as ApiAnalyzeExpenseResponse);
    };
    reader.readAsArrayBuffer(file);
  }

  function parseTextract(textractResponse: ApiAnalyzeExpenseResponse) {
    const expense = new TextractExpense(textractResponse);
    // Iterate through content:
    console.log(`Found ${expense.nDocs} expense docs in file`);
  }

  return (
    <>
      <main className={styles.main}>
        <Grid templateColumns="1fr 1fr" templateRows="10rem 10rem" gap="10rem">
          <View>
            <p>Test</p>
          </View>
          <View>
            <form>
              <h4>Upload</h4>
              <input
                id="myInput"
                type="file"
                onChange={onChangeFile.bind(this)}
              />
            </form>
          </View>
        </Grid>
      </main>
    </>
  );
}

export default Payables;

export async function getServerSideProps() {
  return {
    props: {
      secrets: {
        id: process.env.ACCESSKEYID || "",
        key: process.env.SECRETACCESSKEY || "",
      },
    }, // will be passed to the page component as props
  };
}
