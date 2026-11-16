import { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import { IMedia } from "../../../queries/media";
import { useMedias } from "../../../queries/uploadImage";

export function useImagesFile(images: string[]) {
  const [files, setFiles] = useState<IMedia[]>([]);
  const globalState = useGlobalState();
  const { data: availableMedias, isLoading } = useMedias(
    globalState.office_uuid
  );
  const medias = useMemo(() => availableMedias ?? [], [availableMedias]);

  const giveFiles = (images: string[]) => {
    let result: IMedia[] = [];
    if (!images) return "no images";

    images.forEach((image) => {
      const fileMedia = medias?.find((img) => img.uuid === image);
      if (fileMedia) {
        result.push(fileMedia);
      }
    });

    setFiles(result);
  };

  useEffect(() => {
    giveFiles(images);
  }, [images, medias]);

  return files;
}
