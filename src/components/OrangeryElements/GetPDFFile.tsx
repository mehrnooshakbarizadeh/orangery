import { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import { IMedia, useMedias } from "../../queries/media";

export function usePDFFile(documents: string[]) {
  const [files, setFiles] = useState<IMedia[]>([]);
  const globalState = useGlobalState();
  const { data: availableDocuments, isLoading } = useMedias(
    globalState.office_uuid
  );
  const medias = useMemo(() => availableDocuments ?? [], [availableDocuments]);

  const allDocuments = () =>
    availableDocuments
      ?.filter((doc: IMedia) => doc.is_document)
      .map((md: IMedia) => md) || [];

  const uploadedDocs = (documents: string[]) => {
    let result: IMedia[] = [];
    const matchedDocuments = documents.map((doc) => {
      const matchingDoc = allDocuments().find((md) => md.uuid === doc);
      if (!matchingDoc) {
        // Return null if no match is found
        return null;
      }
      result.push(matchingDoc);
      return result;
      // return matchingDoc;
    });

    setFiles(result);
    // Filter out any null elements and return the remaining documents
    // return matchedDocuments.filter((doc) => doc !== null);
  };
  useEffect(() => {
    uploadedDocs(documents);
  }, [documents, medias]);

  return files;
}
