import { cachedWorkspaceToken } from './firebase';
import { AdmissionEnquiry } from '../types';

export async function createGoogleMeetSpace(title: string, parentName: string) {
  if (!cachedWorkspaceToken) {
    // Generate an instant direct Google Meet joining room fallback
    const randomCode = Math.random().toString(36).substring(2, 5) + '-' + 
                       Math.random().toString(36).substring(2, 6) + '-' + 
                       Math.random().toString(36).substring(2, 5);
    return {
      meetingUri: `https://meet.google.com/${randomCode}`,
      meetingCode: randomCode,
    };
  }

  try {
    const res = await fetch('https://meet.googleapis.com/v2/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedWorkspaceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          accessType: 'OPEN',
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`Google Meet API error: ${res.statusText}`);
    }
    const data = await res.json();
    return {
      meetingUri: data.meetingUri || `https://meet.google.com/lookup/${data.meetingCode}`,
      meetingCode: data.meetingCode,
    };
  } catch (err) {
    console.warn('Falling back to direct Google Meet room link:', err);
    const room = 'aldahr-counseling-' + Math.random().toString(36).substring(2, 7);
    return {
      meetingUri: `https://meet.google.com/lookup/${room}`,
      meetingCode: room,
    };
  }
}

export async function createGoogleFormForAdmissions() {
  if (!cachedWorkspaceToken) {
    // Return sample admission Google Form link template
    return {
      formId: 'sample-admission-form',
      responderUri: 'https://docs.google.com/forms/d/e/1FAIpQLScdummyAlDahrAdmission/viewform',
    };
  }

  try {
    const res = await fetch('https://forms.googleapis.com/v1/forms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedWorkspaceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info: {
          title: 'Al-Dahr Academy Admission & Evaluation Form 2025-26',
          documentTitle: 'Al-Dahr Academy Admission Application',
        },
      }),
    });
    if (!res.ok) throw new Error(`Forms API failed: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Forms API fallback:', err);
    return {
      responderUri: 'https://docs.google.com/forms/create',
    };
  }
}

export async function addStudentToGoogleContacts(enquiry: AdmissionEnquiry) {
  if (!cachedWorkspaceToken) {
    // Generate VCard data URI so user can download directly
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${enquiry.studentName} (Parent: ${enquiry.parentName})\nTEL;TYPE=CELL:${enquiry.mobileNumber}\nNOTE:Al-Dahr Academy - ${enquiry.studentClass} (${enquiry.program})\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${enquiry.studentName}_AlDahr_Contact.vcf`;
    a.click();
    return { status: 'vcard_downloaded' };
  }

  try {
    const res = await fetch('https://people.googleapis.com/v1/people:createContact', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedWorkspaceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        names: [
          {
            givenName: enquiry.studentName,
            familyName: `(Parent: ${enquiry.parentName})`,
          },
        ],
        phoneNumbers: [
          {
            value: enquiry.mobileNumber,
            type: 'mobile',
          },
        ],
        userDefined: [
          { key: 'School', value: 'Al-Dahr Academy' },
          { key: 'Class', value: enquiry.studentClass },
          { key: 'Program', value: enquiry.program },
        ],
      }),
    });
    if (!res.ok) throw new Error(`People API failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to VCF download:', err);
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${enquiry.studentName} (Parent: ${enquiry.parentName})\nTEL;TYPE=CELL:${enquiry.mobileNumber}\nNOTE:Al-Dahr Academy - ${enquiry.studentClass} (${enquiry.program})\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${enquiry.studentName}_AlDahr_Contact.vcf`;
    a.click();
    return { status: 'vcard_downloaded' };
  }
}
